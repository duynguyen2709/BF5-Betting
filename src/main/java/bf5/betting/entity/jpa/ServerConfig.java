package bf5.betting.entity.jpa;

import bf5.betting.constant.ServerConfigKey;
import com.fasterxml.jackson.annotation.JsonInclude;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import lombok.AllArgsConstructor;
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
public class ServerConfig {

  @Id
  @Column(name = "configKey", nullable = false, columnDefinition = "VARCHAR")
  @Enumerated(EnumType.STRING)
  private ServerConfigKey configKey;

  @Column
  private String configValue;
}
