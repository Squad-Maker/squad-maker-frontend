import { RuleConfigSeverity, UserConfig } from '@commitlint/types'

const Configuration: UserConfig = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'subject-case': [RuleConfigSeverity.Disabled, 'never', ['upper-case', 'pascal-case', 'start-case']],
        "body-max-line-length": [RuleConfigSeverity.Warning, "always", 100],
    },
}

export default Configuration;