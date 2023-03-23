package bf5.betting.component;

import bf5.betting.constant.Constant;
import bf5.betting.entity.common.RequestLogEntity;
import bf5.betting.entity.common.RequestWrapper;
import bf5.betting.util.JsonUtil;
import bf5.betting.util.NumberUtil;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpMethod;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

/**
 * @author duynguyen
 */
@Log4j2
public class BaseRequestServlet extends DispatcherServlet {

    @Override
    protected void doDispatch(HttpServletRequest request, @NonNull HttpServletResponse response) throws Exception {
//        if (request.getMethod().equals(HttpMethod.GET.name())) {
//            super.doDispatch(request, response);
//            return;
//        }

        request.setAttribute(Constant.REQUEST_TIME_ATTRIBUTE_KEY, System.currentTimeMillis());
        if (!(request instanceof ContentCachingRequestWrapper)) {
            request = new ContentCachingRequestWrapper(request);
        }
        if (!(response instanceof ContentCachingResponseWrapper)) {
            response = new ContentCachingResponseWrapper(response);
        }

        RequestWrapper wrapper = new RequestWrapper(request);
        try {
            super.doDispatch(wrapper, response);
        } finally {
            setLogData(wrapper, response);
            updateResponse(response);
        }
    }

    private String getResponsePayload(HttpServletResponse response) {
        ContentCachingResponseWrapper wrapper =
                WebUtils.getNativeResponse(response, ContentCachingResponseWrapper.class);
        String result = null;
        if (wrapper != null) {
            byte[] buf = wrapper.getContentAsByteArray();
            if (buf.length > 0) {
                int length = Math.min(buf.length, 40960 * 2);
                try {
                    result = new String(buf, 0, length, wrapper.getCharacterEncoding());
                } catch (Exception e) {
                    log.error("[getResponsePayload] Ex", e);
                }
            }
        }
        return result;
    }

    private void setLogData(RequestWrapper request, HttpServletResponse responseToCache) {
        RequestLogEntity logEnt = new RequestLogEntity();
        try {
            logEnt.setMethod(request.getMethod());
            logEnt.setPath(request.getRequestURI());
            logEnt.setParams(request.getParameterMap());
            logEnt.setRequestTime(NumberUtil.getLongValue(request.getAttribute(Constant.REQUEST_TIME_ATTRIBUTE_KEY)));
            logEnt.setResponseTime(System.currentTimeMillis());
            logEnt.setRequest(UriComponentsBuilder.fromHttpRequest(new ServletServerHttpRequest(request)).build().toUriString());
            logEnt.setBody(request);
            logEnt.setResponse(getResponsePayload(responseToCache));
        } catch (Exception e) {
            log.error("[setLogData] Ex", e);
        } finally {
            log.info("Log Data: {}, Total Time: {}ms", JsonUtil.toJsonString(logEnt), logEnt.getProcessTime());
        }
    }

    private void updateResponse(HttpServletResponse response) {
        try {
            var responseWrapper = WebUtils.getNativeResponse(response, ContentCachingResponseWrapper.class);
            if (responseWrapper != null) {
                responseWrapper.copyBodyToResponse();
            }
            response.setContentType(APPLICATION_JSON_VALUE);
        } catch (Exception e) {
            log.error("[updateResponse] Ex: {}", e.getMessage(), e);
        }
    }
}
