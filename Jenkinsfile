pipeline {
    agent any

    environment {
        PATH = "/snap/bin:$PATH"
        DOCKER_COMPOSE_PATH = '/home/ubuntu/dev/S12P11A202'
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    // Git 리포지토리에서 체크아웃할 때 자격 증명을 사용하도록 설정
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/dev']],  // dev 브랜치에서 체크아웃
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [],
                        userRemoteConfigs: [[
                            url: 'https://lab.ssafy.com/s12-webmobile3-sub1/S12P11A202.git',
                            credentialsId: 'gitlab-basic'  // 사용하려는 Credentials ID
                        ]]
                    ])
                }
            }
        }

        stage('Check Docker Compose Path') {
            steps {
                script {
                    sh 'export PATH=$PATH:/snap/bin'
                    sh 'echo $PATH'
                    sh 'which docker-compose'
                }
            }
        }

        stage('Shutdown Docker Containers') {
            steps {
                script {
                    sh 'cd /home/ubuntu/dev/S12P11A202 && docker-compose down'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    dir("$DOCKER_COMPOSE_PATH") {
                        sh 'docker-compose -f docker-compose.yml build --no-cache'
                    }
                }
            }
        }

        stage('Start Docker Containers') {
            steps {
                script {
                    dir("$DOCKER_COMPOSE_PATH") {
                        sh 'docker-compose -f docker-compose.yml up -d'
                    }
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    sh 'docker ps'
                }
            }
        }
    }

    post {
        success {
            echo '배포가 성공적으로 완료되었습니다.'
        }
        failure {
            echo '배포에 실패하였습니다.'
        }
    }
}
