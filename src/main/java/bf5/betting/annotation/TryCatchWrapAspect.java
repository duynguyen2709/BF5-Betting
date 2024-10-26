package bf5.betting.annotation;

import bf5.betting.service.TelegramNotiService;
import bf5.betting.util.JsonUtil;
import lombok.extern.log4j.Log4j2;
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
      String error = String.format("Method: %s\nArgs = %s\nException: %s",
          joinPoint.getSignature(), JsonUtil.toJsonString(joinPoint.getArgs()), ex.getMessage());
      log.error(error);
      telegramNotiService.sendExceptionAlert(error);
      throw ex;
    }
  }
}
