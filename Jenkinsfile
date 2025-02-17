pipeline {
    agent any
    environment {
        HOST_IP = 'i12a202.p.ssafy.io'
        SSH_USER = 'ubuntu'
        SSH_KEY = credentials('prefix')  // Jenkins에서 저장한 SSH Key Credential ID
    }
    stages {
        stage('SSH into EC2 and Deploy') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'gitlab-api-token', variable: 'GIT_TOKEN')]) {
                        sh """
                            ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ${SSH_USER}@${HOST_IP} << 'EOF'
                            cd /home/ubuntu/dev/S12P11A202
                            git reset --hard
                            git switch release
                            git pull https://oauth2:${GIT_TOKEN}@lab.ssafy.com/s12-webmobile3-sub1/S12P11A202.git release
                            docker-compose down
                            docker-compose build --no-cache
                            docker-compose up -d
                            docker ps
                        """
                    }
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
