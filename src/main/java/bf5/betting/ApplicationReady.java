//package bf5.betting;
//
//import bf5.betting.service.ServerConfigService;
//import java.util.ArrayList;
//import java.util.Collection;
//import java.util.List;
//import java.util.Map;
//import lombok.AllArgsConstructor;
//import lombok.extern.log4j.Log4j2;
//import org.springframework.boot.context.event.ApplicationReadyEvent;
//import org.springframework.context.event.EventListener;
//import org.springframework.core.env.ConfigurableEnvironment;
//import org.springframework.core.env.MapPropertySource;
//import org.springframework.stereotype.Component;
////
//
///// **
//// * @author duynguyen
//// */
//@AllArgsConstructor
//@Log4j2
//@Component
//public class ApplicationReady {
//
//  private final ConfigurableEnvironment configurableEnvironment;
//
//  private final ServerConfigService serverConfigService;
//
//  @EventListener(ApplicationReadyEvent.class)
//  public void init() {
//    showConfiguration();
//  }
//
//  private void showConfiguration() {
//    log.info("##################### Show Configuration #####################");
//    List<MapPropertySource> propertySources = new ArrayList<>();
//    configurableEnvironment.getPropertySources()
//                           .forEach((it) -> {
//                             if (it instanceof MapPropertySource && it.getName()
//                                                                      .contains("application.yaml")) {
//                               propertySources.add((MapPropertySource) it);
//                             }
//                           });
//
//    propertySources.stream()
//                   .map((propertySource) ->
//                            ((Map) propertySource.getSource()).keySet())
//                   .flatMap(Collection::stream)
//                   .distinct()
//                   .sorted()
//                   .forEach((key) -> {
//                     try {
//                       log.info(key + "=" + configurableEnvironment.getProperty(String.valueOf(key)));
//                     } catch (Exception var3) {
//                       log.warn("{} -> {}", key, var3.getMessage());
//                     }
//                   });
//    log.info("##################### End show Configuration #####################");
//  }
//
//}
