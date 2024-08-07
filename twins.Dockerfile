FROM bellsoft/liberica-openjdk-alpine:20-x86_64
RUN mkdir -p /opt/twins
RUN mkdir /opt/twins/logs
WORKDIR ./opt/twins
COPY twins/core/build/libs/twins-core-1.0.0.jar /opt/elpmee/twins/twins.jar
ENTRYPOINT ["java"]
CMD ["-jar", "--add-opens=java.base/java.lang.reflect=ALL-UNNAMED", "-Dapp.home=/opt/elpmee/twins/", "/opt/elpmee/twins/twins.jar"]
EXPOSE 8443
