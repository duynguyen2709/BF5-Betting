package bf5.betting.converter;

import bf5.betting.constant.PaymentAction;
import bf5.betting.exception.EntityNotFoundException;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.Optional;
import java.util.stream.Stream;

/**
 * @author duynguyen
 */
@Converter(autoApply = true)
public class PaymentActionEnumConverter implements AttributeConverter<PaymentAction, String> {

  @Override
  public String convertToDatabaseColumn(PaymentAction action) {
    return Optional.ofNullable(action)
        .map(e -> e.name().toUpperCase())
        .orElse(null);
  }

  @Override
  public PaymentAction convertToEntityAttribute(String action) {
    return Stream.of(PaymentAction.values())
        .filter(c -> c.name().equalsIgnoreCase(action))
        .findFirst()
        .orElseThrow(() -> EntityNotFoundException.builder()
            .clazz(PaymentAction.class)
            .id(action)
            .build());
  }
}
