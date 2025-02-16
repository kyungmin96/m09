pipeline {
    agent any

    environment {
        HOST_IP = 'i12a202.p.ssafy.io'  // EC2의 퍼블릭 DNS
        SSH_USER = 'ubuntu'  // EC2의 사용자 (ubuntu)
        SSH_KEY = credentials('prefix')  // Jenkins에서 저장한 SSH Key Credential ID
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

        stage('SSH into EC2 and Deploy') {
            steps {
                script {
                    // EC2에 SSH로 접속한 후 여러 명령을 한 번에 실행
                    sh """
                        ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ${SSH_USER}@${HOST_IP} << 'EOF'
                        cd /home/ubuntu/dev/S12P11A202
                        docker-compose down
                        docker-compose build --no-cache
                        docker-compose up -d
                        docker ps
                    """
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
