package bf5.betting.config;

import bf5.betting.util.RequestUtil;
import java.io.IOException;
import lombok.extern.log4j.Log4j2;
import org.apache.hc.client5.http.HttpRequestRetryStrategy;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.HttpRequest;
import org.apache.hc.core5.http.HttpResponse;
import org.apache.hc.core5.http.protocol.HttpContext;
import org.apache.hc.core5.util.TimeValue;
import org.apache.hc.core5.util.Timeout;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.retry.backoff.ExponentialBackOffPolicy;
import org.springframework.retry.policy.SimpleRetryPolicy;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.web.client.RestTemplate;

@Configuration
@EnableRetry
@Log4j2
public class HttpClientConfig {

  private static final int MAX_RETRIES = 3;
  private static final int INITIAL_RETRY_DELAY = 2;

  @Bean
  public RetryTemplate retryTemplate() {
    RetryTemplate retryTemplate = new RetryTemplate();

    SimpleRetryPolicy retryPolicy = new SimpleRetryPolicy();
    retryPolicy.setMaxAttempts(MAX_RETRIES + 1);
    retryTemplate.setRetryPolicy(retryPolicy);

    ExponentialBackOffPolicy backOffPolicy = new ExponentialBackOffPolicy();
    backOffPolicy.setInitialInterval(INITIAL_RETRY_DELAY * 1000);
    backOffPolicy.setMultiplier(2);
    retryTemplate.setBackOffPolicy(backOffPolicy);

    return retryTemplate;
  }

  @Bean
  public RestTemplate restTemplate() {
    return new RestTemplate();
  }

  @Bean
  public CloseableHttpClient httpClient() {
    HttpRequestRetryStrategy retryStrategy = new HttpRequestRetryStrategy() {

      @Override
      public boolean retryRequest(HttpRequest httpRequest, IOException e, int retryCount, HttpContext httpContext) {
        if (retryCount <= MAX_RETRIES) {
          log.info("[IOException] Retry request #{}, last exception: {}", retryCount,
                   RequestUtil.getDetailedMessage(e));
          return true;
        }
        return false;
      }

      @Override
      public boolean retryRequest(HttpResponse response, int retryCount, HttpContext context) {
        int statusCode = response.getCode();
        if (statusCode < 400) {
          return false;
        }
        if (statusCode < 500) {
          log.error("[HttpClient] Skipping retry due to 4xx client error: {}", response.getReasonPhrase());
          return false;
        }
        if (retryCount <= MAX_RETRIES) {
          log.warn("[HttpResponseException] Retry request #{}, last exception: {}", retryCount,
                   response.getReasonPhrase());
          return true;
        }
        return false;
      }

      @Override
      public TimeValue getRetryInterval(HttpResponse response, int retryCount, HttpContext context) {
        long delayInSeconds = INITIAL_RETRY_DELAY * (long) Math.pow(2, retryCount - 1);
        return TimeValue.ofSeconds(delayInSeconds);
      }
    };
    return HttpClients.custom()
                      .setRetryStrategy(retryStrategy)
                      .setDefaultRequestConfig(RequestConfig.custom()
                                                            .setConnectTimeout(
                                                                Timeout.ofSeconds(30))
                                                            .setResponseTimeout(
                                                                Timeout.ofSeconds(30))
                                                            .build())
                      .build();
  }
}
