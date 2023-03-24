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
 * @author duynguyen
 */
@RestControllerAdvice
@Log4j2
@Order(Ordered.HIGHEST_PRECEDENCE)
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(value = {ConstraintViolationException.class, IllegalArgumentException.class})
    public ResponseEntity<BaseResponse<Object>> handleConstraintViolation(IllegalArgumentException ex) {
        return response(HttpStatus.BAD_REQUEST, ex);
    }

    @ExceptionHandler(value = {UncheckedHttpResponseException.class})
    public ResponseEntity<BaseResponse<Object>> handleHttpResponseException(UncheckedHttpResponseException ex) {
        return response(HttpStatus.valueOf(ex.getStatusCode()), ex);
    }

    @ExceptionHandler(value = {EntityNotFoundException.class})
    public ResponseEntity<BaseResponse<Object>> handleNotFound(EntityNotFoundException ex) {
        return response(HttpStatus.NOT_FOUND, ex);
    }

    @ExceptionHandler(value = {Exception.class})
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<BaseResponse<Object>> handle(Exception ex) {
        return response(HttpStatus.INTERNAL_SERVER_ERROR, ex);
    }

    private ResponseEntity<BaseResponse<Object>> response(HttpStatus status, Exception ex) {
        log.error("An exception occurred, ex: {}", ex.getMessage(), ex);
        return ResponseEntity.status(status)
                .contentType(MediaType.APPLICATION_JSON)
                .body(BaseResponse.failed(status.value(), "An exception occurred. Try again later."));
    }

}
