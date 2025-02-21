# 🚀 M09 backend/

이 프로젝트는 Amazon Corretto 17을 사용하여 스프링부트로 작성된 백엔드입니다. Java 17 버전과 Gradle 빌드 툴을 사용하여 생성되었습니다.

## 🛠️ 빌드 및 실행

> ⚠️&nbsp;&nbsp;중요 !!!

&nbsp;&nbsp;백엔드를 빌드 및 실행하려면 RDBMS가 실행 중이어야 하고, m09 데이터베이스가 있어야 합니다.<br>
&nbsp;&nbsp;또한, 환경 변수 설정이 필요합니다.

### 📦 빌드

백엔드를 빌드하려면 다음 명령어를 실행하세요:

```bash
cd ./m09
./gradlew build
```

### ▶️ 실행

백엔드를 실행하려면 다음 명령어를 사용하세요:

```bash
# cd ./m09 (./m09 로 이동한 후)
./gradlew bootRun
```

## 📄 참고 사항

백엔드의 환경 변수 설정에 대한 자세한 내용은 `exec/README.md` 파일을 참고하세요. 아래는 환경 변수 설정 예시입니다:

<details>
<summary>환경 변수 설정 예시</summary>

```properties
# 서버 기본 설정
spring.application.name=m09
server.address=0.0.0.0
server.port=8080
server.servlet.context-path=/api/v1

# 데이터베이스 연결 설정
spring.datasource.url=jdbc:mysql://i12a202.p.ssafy.io:3306/m09
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA 설정
spring.jpa.hibernate.ddl-auto=update

# 프록시 서버 설정
server.forward-headers-strategy=native
```

</details>
