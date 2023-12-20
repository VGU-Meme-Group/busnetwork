pipeline {
  agent any
  environment {
        RELEASE = "1.0.0"
        IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
    }
  stages {
    stage("Cleanup Workspace"){
                steps {
                cleanWs()
                }
        }
      stage("Checkout from SCM"){
                steps {
                    git branch: 'main', credentialsId: 'b8361845-ca48-4303-8576-f36422be9bf9', url: 'https://github.com/VGU-Meme-Group/busnetwork'
                    bat 'git branch'
                }
        }
    // stage('Checkout') {
    //   steps {
    //     echo 'Check out a branch'
    //     checkout scmGit(branches: [
    //       [name: '*/MBNP-64-App-UI']
    //     ], extensions: [], userRemoteConfigs: [
    //       [url: 'https://github.com/VGU-Meme-Group/busnetwork']
    //     ])
    //     bat 'git branch'
    //   }
    // }

    stage('Test') {
            when {
                changeset "backend/*"
            }
            steps {
                script {
                    echo "Running tests when changes occur in 'backend/'"
                    dir('backend/__tests__') {
                        bat 'npm install'
                        bat 'npm test'
                    }
                }
            }

            when {
                changeset "frontend/*"
            }
            steps {
                script {
                    echo "Running tests when changes occur in 'frontend/'"
                    dir('frontend/__tests__') {
                        bat 'npm install'
                        bat 'npm test'
                    }
                }
            }
        }

    stage('Build') {

        when {
                changeset "frontend/*"
            }
      steps {
        script {
          withDockerRegistry([credentialsId: 'docker_hub', url: 'https://index.docker.io/v1/']) {
            bat "docker build -t tuna2002/bus_frontend:${env.IMAGE_TAG} ."
          }
        }
        bat 'git branch'
      }

      when {
                changeset "backend/*"
            }
      steps {
        script {
          withDockerRegistry([credentialsId: 'docker_hub', url: 'https://index.docker.io/v1/']) {
            bat "docker build -t tuna2002/bus_visualize_current_traffic_service:websocket-${env.IMAGE_TAG} ."
            bat "docker build -t tuna2002/bus_visualize_current_traffic_service:api-${env.IMAGE_TAG} ."
          }
        }
        bat 'git branch'
      }

      when {
                changeset "streaming_data/*"
            }
      steps {
        script {
          withDockerRegistry([credentialsId: 'docker_hub', url: 'https://index.docker.io/v1/']) {
            bat "docker build -t tuna2002/bus_streaming_data_service:kafka-producer-${env.IMAGE_TAG} ."
            bat "docker build -t tuna2002/bus_streaming_data_service:kafka-consumer-${env.IMAGE_TAG} ."
          }
        }
        bat 'git branch'
      }

        when {
                changeset "frontend/*"
            }
      steps {
        script {
          withDockerRegistry([credentialsId: 'docker_hub', url: 'https://index.docker.io/v1/']) {
            bat "docker build -t tuna2002/bus_machine_learning_service:${env.IMAGE_TAG} ."
          }
        }
        bat 'git branch'
      }
    }
    stage('Push') {
      
         when {
                changeset "streaming_data/*"
            }
      steps {
        script {
          withDockerRegistry([credentialsId: 'docker_hub', url: 'https://index.docker.io/v1/']) {
             bat "docker push tuna2002/bus_streaming_data_service:kafka-producer-${env.IMAGE_TAG}"
            bat "docker push tuna2002/bus_streaming_data_service:kafka-consumer-${env.IMAGE_TAG}"
          }
        }
        bat 'git branch'
      }

        when {
                changeset "backend/*"
            }
      steps {
        script {
          withDockerRegistry([credentialsId: 'docker_hub', url: 'https://index.docker.io/v1/']) {
             bat "docker push tuna2002/bus_visualize_current_traffic_service:websocket-${env.IMAGE_TAG}"
            bat "docker push tuna2002/bus_visualize_current_traffic_service:api-${env.IMAGE_TAG}"
          }
        }
        bat 'git branch'
      }

         when {
                changeset "machine_learning/*"
            }
      steps {
        script {
          withDockerRegistry([credentialsId: 'docker_hub', url: 'https://index.docker.io/v1/']) {
            bat "docker push tuna2002/bus_machine_learning_service:${env.IMAGE_TAG}"
          }
        }
        bat 'git branch'
      }
    }
    // stage('Update Manifests') {
    //   steps {
    //     script {
    //       // Set the new image tag in the Deployment YAML file using PowerShell
    //       powershell """
    //         (Get-Content '${WORKSPACE}\\kubernetes\\deployment.yaml' -Raw) -replace 'image: minhquanvus/app-ui:.*', 'image: minhquanvus/app-ui:${env.IMAGE_TAG}' | Set-Content '${WORKSPACE}\\kubernetes\\deployment.yaml'
    //       """
    //       bat 'git config user.email "17640@student.vgu.edu.vn"'
    //       bat 'git config user.name "minhquanvus1"'
    //       bat 'git branch'
    //       // bat 'git checkout MBNP-64-App-UI'
    //       // bat 'git branch'
    //       bat 'git add kubernetes/deployment.yaml'
    //       bat 'git commit -m "MBNP-64-App-UI-Update-image-tag-in-deployment.yaml"'
          //bat 'git push origin MBNP-64-App-UI'
        //   withCredentials([usernamePassword(credentialsId: 'b8361845-ca48-4303-8576-f36422be9bf9', passwordVariable: 'b8361845-ca48-4303-8576-f36422be9bf9', usernameVariable: 'vgucse1')]) {
        //     def encodedPassword = URLEncoder.encode("b8361845-ca48-4303-8576-f36422be9bf9",'UTF-8')
            
            
            
        //     bat "git push https://vgucse1:${encodedPassword}@github.com/VGU-Meme-Group/busnetwork.git"
        // }
          // Commit the changes
//         withCredentials([string(credentialsId: 'github_token', variable: 'GITHUB_TOKEN')]) {
//     // some block
//     bat 'git push https://$GITHUB_TOKEN@github.com/VGU-Meme-Group/busnetwork.git MBNP-64-App-UI'

 }