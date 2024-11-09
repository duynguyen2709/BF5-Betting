package bf5.betting.annotation;

import bf5.betting.service.TelegramNotiService;
import bf5.betting.util.JsonUtil;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author duynguyen
 */
@Aspect
@Component
@Log4j2
public class TryCatchWrapAspect {

  @Autowired
  private TelegramNotiService telegramNotiService;

  @Around("@annotation(bf5.betting.annotation.TryCatchWrap)")
  public Object wrap(ProceedingJoinPoint joinPoint) throws Throwable {
    try {
      return joinPoint.proceed();
    } catch (Throwable ex) {
      String shortError = String.format("- Method: %s\n- Args = %s\n- Exception: %s",
                                        joinPoint.getSignature(), JsonUtil.toJsonString(joinPoint.getArgs()),
                                        ex.getMessage());
      String detailMessage = StringUtils.substringBefore(ex.getMessage(), "; nested exception is");

      log.error("Exception Happened\nSummary: {}\nDetail Error Message: {}", shortError, detailMessage);
      telegramNotiService.sendExceptionAlert(shortError);
      throw ex;
    }
  }
}
