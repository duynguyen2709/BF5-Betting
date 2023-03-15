package bf5.betting.exception;

import bf5.betting.entity.response.BaseResponse;
import lombok.extern.log4j.Log4j2;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * @author duyna5
 */
@RestControllerAdvice
@Log4j2
@Order(Ordered.HIGHEST_PRECEDENCE)
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(value = {ConstraintViolationException.class, IllegalArgumentException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<BaseResponse> handleConstraintViolation(IllegalArgumentException ex) {
        return response(HttpStatus.BAD_REQUEST, ex);
    }

    @ExceptionHandler(value = {EntityNotFoundException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<BaseResponse> handleNotFound(EntityNotFoundException ex) {
        return response(HttpStatus.NOT_FOUND, ex);
    }

    @ExceptionHandler(value = {Exception.class})
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<BaseResponse> handle(Exception ex) {
        return response(HttpStatus.INTERNAL_SERVER_ERROR, ex);
    }

    private ResponseEntity<BaseResponse> response(HttpStatus status, Exception ex) {
        log.error("An exception occurred, ex: {}", ex.getMessage(), ex);
        return ResponseEntity.status(status)
                .contentType(MediaType.APPLICATION_JSON)
                .body(BaseResponse.failed(status.value(), "An exception occurred. Try again later."));
    }

}
