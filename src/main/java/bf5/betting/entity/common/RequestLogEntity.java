package bf5.betting.entity.common;

import bf5.betting.util.JsonUtil;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;

import java.io.Serializable;
import java.util.Objects;

/**
 * @author duynguyen
 */
@Data
@NoArgsConstructor
public class RequestLogEntity implements Serializable {
    private String method = "";
    private String path = "";
    private String request = "";
    private Object params;
    private Object body;
    private long requestTime = 0L;
    private long responseTime = 0L;
    private Object response;

    public void setResponse(String res) {
        try {
            this.response = JsonUtil.fromJsonString(res, Object.class);
        } catch (Exception ex) {
            this.response = res;
        }
    }

    public void setBody(RequestWrapper request) {
        if (StringUtils.isNotBlank(request.getBody())) {
            Object obj = JsonUtil.fromJsonString(request.getBody(), Object.class);
            this.body = (obj != null) ? obj : "";
        }
    }

    public long getProcessTime() {
        return this.getResponseTime() - this.getRequestTime();
    }
}
