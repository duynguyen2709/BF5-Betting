package bf5.betting;

import bf5.betting.util.SubsetUtil;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * @author duynguyen
 */
@AllArgsConstructor
@Log4j2
@Component
public class ApplicationReady {
    private final ConfigurableEnvironment configurableEnvironment;

    @EventListener(ApplicationReadyEvent.class)
    public void init() {
        showConfiguration();

        List<Double> ratioList = new ArrayList<>();
        ratioList.add(1.87);
        ratioList.add(1.81);
        ratioList.add(1.95);
        ratioList.add(1.836);
        ratioList.add(1.81);
        ratioList.add(1.97);
        int combination = 4;
        List<List<Double>> ratioSubsetsOfCombination = SubsetUtil.generateSubsetOfSize(ratioList, combination);
        double sumRatioOfCombinations = ratioSubsetsOfCombination.stream()
                .mapToDouble(subset -> subset.stream()
                        .reduce(1.0, (ratio1, ratio2) -> ratio1 * ratio2))
                .sum();
        log.info((double)Math.round((sumRatioOfCombinations / ratioSubsetsOfCombination.size()) * 100000d) / 100000d);

    }

    private void showConfiguration() {
        log.info("##################### Show Configuration #####################");
        List<MapPropertySource> propertySources = new ArrayList<>();
        configurableEnvironment.getPropertySources().forEach((it) -> {
            if (it instanceof MapPropertySource && it.getName().contains("application.yaml")) {
                propertySources.add((MapPropertySource) it);
            }
        });

        propertySources.stream().map((propertySource) ->
                        ((Map) propertySource.getSource()).keySet())
                .flatMap(Collection::stream)
                .distinct()
                .sorted()
                .forEach((key) -> {
                    try {
                        log.info(key + "=" + configurableEnvironment.getProperty(String.valueOf(key)));
                    } catch (Exception var3) {
                        log.warn("{} -> {}", key, var3.getMessage());
                    }
                });
        log.info("##################### End show Configuration #####################");
    }

}
