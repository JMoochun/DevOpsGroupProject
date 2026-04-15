/**
 * COMP231 DevOps — Jenkins declarative pipeline (Node.js + React)
 *
 * Prerequisites on Jenkins:
 * - Node.js 20+ on PATH for the Jenkins service account
 * - Plugin: "SonarQube Scanner for Jenkins" (SonarSource) — REQUIRED; provides withSonarQubeEnv.
 *   Without it you get: No such DSL method 'withSonarQubeEnv'. Install plugin + restart Jenkins.
 * - SonarQube Scanner CLI on PATH (sonar-scanner)
 * - Manage Jenkins → System → SonarQube servers → Name must match withSonarQubeEnv('SonarQube') below
 *
 * This repo uses `bat` steps so the job runs on Windows agents. Jenkins is often installed
 * as a service (e.g. Local System); `sh` may invoke WSL and fail with WSL_E_LOCAL_SYSTEM_NOT_SUPPORTED.
 * For Linux agents only, replace `bat` with `sh` and adjust the Deliver tar line if needed.
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
                            bat 'npm ci'
                        }
                    }
                }
                stage('Client npm ci') {
                    steps {
                        dir('client') {
                            bat 'npm ci'
                        }
                    }
                }
            }
        }

        stage('Build') {
            steps {
                dir('client') {
                    bat 'npm run build'
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Server unit tests + coverage') {
                    steps {
                        dir('server') {
                            bat 'npm run test:coverage'
                        }
                    }
                }
                stage('Client unit tests + coverage') {
                    steps {
                        dir('client') {
                            bat 'npm run test:coverage'
                        }
                    }
                }
            }
        }

        stage('SonarQube analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    bat 'sonar-scanner'
                }
            }
        }

        stage('Deliver') {
            steps {
                // Windows 10+ includes tar.exe; run from workspace root
                bat 'tar -czvf inventory-release.tgz client/dist server/package.json server/package-lock.json server/src'
            }
        }

        stage('Deploy to Development') {
            steps {
                echo '[MOCK] Deploy artifact to Dev - replace with your script (e.g. copy to server, Docker, Azure Web App)'
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
                echo '[MOCK] Deploy to Production - gate with approvals in real use'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'inventory-release.tgz', allowEmptyArchive: true, fingerprint: true
            archiveArtifacts artifacts: '**/coverage/**', allowEmptyArchive: true
        }
        success {
            echo 'Pipeline completed successfully - open Blue Ocean to view stage graph and history.'
        }
    }
}
