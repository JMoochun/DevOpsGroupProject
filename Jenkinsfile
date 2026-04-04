/**
 * COMP231 DevOps — Jenkins declarative pipeline (Node.js + React)
 *
 * Prerequisites on Jenkins:
 * - Node.js 20+ (nvm or NodeJS plugin)
 * - SonarQube Scanner CLI on PATH, OR use a Docker agent with scanner installed
 * - Jenkins: Manage Jenkins → Configure System → SonarQube servers → name must match
 *   withSonarQubeEnv('SonarQube') below (or rename to match your server entry)
 * - Pipeline job: Definition = Pipeline script from SCM; SCM Poll trigger can also be
 *   enabled in the job UI in addition to pollSCM below
 *
 * Agents: uses `sh` (Linux/macOS agents). For Windows agents, replace `sh` with `bat`
 * and adjust commands.
 */

pipeline {
    agent any

    options {
        timestamps()
    }

    triggers {
        pollSCM('H/15 * * * *')
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            parallel {
                stage('Server npm ci') {
                    steps {
                        dir('server') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Client npm ci') {
                    steps {
                        dir('client') {
                            sh 'npm ci'
                        }
                    }
                }
            }
        }

        stage('Build') {
            steps {
                dir('client') {
                    sh 'npm run build'
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Server unit tests + coverage') {
                    steps {
                        dir('server') {
                            sh 'npm run test:coverage'
                        }
                    }
                }
                stage('Client unit tests + coverage') {
                    steps {
                        dir('client') {
                            sh 'npm run test:coverage'
                        }
                    }
                }
            }
        }

        stage('SonarQube analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner'
                }
            }
        }

        stage('Deliver') {
            steps {
                sh '''
                    tar -czvf inventory-release.tgz \
                      client/dist \
                      server/package.json \
                      server/package-lock.json \
                      server/src
                '''
            }
        }

        stage('Deploy to Development') {
            steps {
                echo '[MOCK] Deploy artifact to Dev — replace with your script (e.g. copy to server, Docker, Azure Web App)'
                echo "Artifact: inventory-release.tgz (build ${env.BUILD_NUMBER})"
            }
        }

        stage('Deploy to QAT') {
            steps {
                echo '[MOCK] Deploy to QAT environment'
            }
        }

        stage('Deploy to Staging') {
            steps {
                echo '[MOCK] Deploy to Staging environment'
            }
        }

        stage('Deploy to Production') {
            steps {
                echo '[MOCK] Deploy to Production — gate with approvals in real use'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'inventory-release.tgz', allowEmptyArchive: true, fingerprint: true
            archiveArtifacts artifacts: '**/coverage/**', allowEmptyArchive: true
        }
        success {
            echo 'Pipeline completed successfully — open Blue Ocean to view stage graph and history.'
        }
    }
}
