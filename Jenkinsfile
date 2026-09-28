pipeline {
  agent any

  parameters {
    string(
      name: 'BASE_URL',
      defaultValue: 'https://10.21.20.200:8500/',
      description: 'Application URL used by the Playwright tests'
    )
    booleanParam(
      name: 'IGNORE_HTTPS_ERRORS',
      defaultValue: true,
      description: 'Allow self-signed certificates in internal environments'
    )
  }

  environment {
    CI = 'true'
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '20'))
    timestamps()
    timeout(time: 45, unit: 'MINUTES')
  }

  stages {
    stage('Install dependencies') {
      steps {
        bat 'call npm.cmd ci'
        bat 'call npx.cmd playwright install chromium'
      }
    }

    stage('Run Chromium test suite') {
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: 'playwright-test-credentials',
            usernameVariable: 'LOGIN_USERNAME',
            passwordVariable: 'LOGIN_PASSWORD'
          )
        ]) {
          withEnv([
            "BASE_URL=${params.BASE_URL}",
            "IGNORE_HTTPS_ERRORS=${params.IGNORE_HTTPS_ERRORS}"
          ]) {
            bat 'call npm.cmd run test:ci'
          }
        }
      }
    }
  }

  post {
    always {
      junit testResults: 'reports/results.xml', allowEmptyResults: false
      archiveArtifacts(
        artifacts: 'reports/**,test-results/**',
        allowEmptyArchive: false,
        fingerprint: false
      )
      try {
        publishHTML(target: [
          reportDir: 'reports/html',
          reportFiles: 'index.html',
          reportName: 'Playwright HTML Report',
          keepAll: true,
          alwaysLinkToLastBuild: true,
          allowMissing: false
        ])
      } catch (NoSuchMethodError missingHtmlPublisher) {
        echo 'HTML Publisher plugin is not installed; the HTML report remains in Build Artifacts.'
      }
    }
  }
}