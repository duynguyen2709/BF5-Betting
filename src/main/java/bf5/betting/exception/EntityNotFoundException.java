package bf5.betting.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;

/**
 * @author duynguyen
 */
@AllArgsConstructor
@Builder
public class EntityNotFoundException extends RuntimeException {
    private final Class clazz;
    private final Object id;

    @Override
    public String getMessage() {
        return String.format("NotFoundException{Class = %s; Id = %s}", clazz.getSimpleName(), id);
    }

    @Override
    public String toString() {
        return getMessage();
    }
}
