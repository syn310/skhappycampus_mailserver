@Library('retort-lib') _
def label = "jenkins-${UUID.randomUUID().toString()}"

def ZCP_USERID='mgmtsv-admin'
def DOCKER_IMAGE='skhappycampus/skhappycampus-mailserver'
def K8S_NAMESPACE='skhappycampus'

podTemplate(label:label,
    serviceAccount: "zcp-system-sa-${ZCP_USERID}",
    containers: [
        containerTemplate(name: 'npm', image:'node:10.15.3', ttyEnabled: true, command: 'cat'),
        containerTemplate(name: 'docker', image: 'docker', ttyEnabled: true, command: 'cat'),
        containerTemplate(name: 'kubectl', image: 'lachlanevenson/k8s-kubectl', ttyEnabled: true, command: 'cat')
    ],
    volumes: [
        hostPathVolume(hostPath: '/var/run/docker.sock', mountPath: '/var/run/docker.sock'),
        persistentVolumeClaim(mountPath: '/root/.m2', claimName: 'zcp-jenkins-mvn-repo')
    ]) {

    node(label) {
        stage('SOURCE CHECKOUT') {
            def repo = checkout scm
            env.SCM_INFO = repo.inspect()
        }
        
        stage('BUILD') {
            container('npm') {
                sh 'ls -alF'
                sh 'npm install'
                sh 'npm install pm2 node-gyp'
                sh 'node -v'
                sh 'npm -v'
                sh 'npm cache clean --force'
            }
        }
        
        stage('BUILD DOCKER IMAGE') {
            container('docker') {
                dockerCmd.build tag: "${HARBOR_REGISTRY}/${DOCKER_IMAGE}:${BUILD_NUMBER}"
                dockerCmd.push registry: HARBOR_REGISTRY, imageName: DOCKER_IMAGE, imageVersion: BUILD_NUMBER, credentialsId: "HARBOR_CREDENTIALS"
            }
        }

        stage('DEPLOY') {
            container('kubectl') {
                kubeCmd.apply file: 'k8s/skhappycampus-mailserver-service.yaml', namespace: K8S_NAMESPACE
                yaml.update file: 'k8s/skhappycampus-mailserver-deployment.yaml', update: ['.spec.template.spec.containers[0].image': "${HARBOR_REGISTRY}/${DOCKER_IMAGE}:${BUILD_NUMBER}"]
                kubeCmd.apply file: 'k8s/skhappycampus-mailserver-deployment.yaml', wait: 1000, recoverOnFail: false, namespace: K8S_NAMESPACE
            }
        }
    }
}
