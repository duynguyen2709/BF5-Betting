package bf5.betting.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.apache.hc.client5.http.HttpResponseException;

/**
 * @author duynguyen
 **/
@Data
@AllArgsConstructor
public class UncheckedHttpResponseException extends RuntimeException {
    private final int statusCode;
    private final String reasonPhrase;
    private Throwable originalCause;

    public UncheckedHttpResponseException(HttpResponseException httpResponseException) {
        this.statusCode = httpResponseException.getStatusCode();
        this.reasonPhrase = httpResponseException.getReasonPhrase();
        this.originalCause = httpResponseException;
    }

    @Override
    public String getMessage() {
        return this.toString();
    }
}
