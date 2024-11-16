package bf5.betting.entity.jpa;

import com.fasterxml.jackson.annotation.JsonInclude;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author duynguyen
 **/
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "ServerConfig")
@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
public class ServerConfig {

  @Id
  private String configKey;

  @Column
  private String configValue;
}
