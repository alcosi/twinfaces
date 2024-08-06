FROM bellsoft/liberica-openjdk-alpine:20-x86_64
RUN mkdir -p /opt/elpmee/twins
RUN mkdir /opt/elpmee/twins/logs
WORKDIR ./opt/elpmee/twins
COPY twins/core/build/libs/twins-core-1.0.0.jar /opt/elpmee/twins/twins.jar
ENTRYPOINT ["java"]
CMD ["-jar", "--add-opens=java.base/java.lang.reflect=ALL-UNNAMED", "-Dapp.home=/opt/elpmee/twins/", "/opt/elpmee/twins/twins.jar"]
EXPOSE 8443
