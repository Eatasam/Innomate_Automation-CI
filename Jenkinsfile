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

  stages {
    stage('Install dependencies') {
      steps {
        bat 'call npm.cmd ci'
        bat 'call npx.cmd playwright install'
      }
    }

    stage('Run login and user creation tests') {
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: 'playwright-test-credentials',
            usernameVariable: 'LOGIN_USERNAME',
            passwordVariable: 'LOGIN_PASSWORD'
          )
        ]) {
          bat 'set BASE_URL=%BASE_URL%&& set IGNORE_HTTPS_ERRORS=%IGNORE_HTTPS_ERRORS%&& call npx.cmd playwright test tests/logintest.spec.js tests/usercreation.spec.js --project=chromium'
        }
      }
    }
  }

  post {
    always {
      junit testResults: 'reports/results.xml', allowEmptyResults: true
      archiveArtifacts(
        artifacts: 'reports/**,test-results/**',
        allowEmptyArchive: true,
        fingerprint: false
      )
    }
  }
}