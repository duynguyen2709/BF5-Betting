package bf5.betting.entity.jpa;

import com.fasterxml.jackson.annotation.JsonInclude;
import javax.persistence.Column;
import javax.persistence.Entity;
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
@Entity(name = "TeamData")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TeamData {

  @Id
  private String teamName;
  @Column
  private String logoUrl;
  @Column
  private String vnTeamName;
}
