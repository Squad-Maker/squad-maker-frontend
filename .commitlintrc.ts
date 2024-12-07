import { UserConfig } from '@commitlint/types'

const Configuration: UserConfig = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'subject-case': [0, 'never', ['upper-case', 'pascal-case', 'start-case']],
    },
}

export default Configuration;
