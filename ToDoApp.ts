import { IConfigurationExtend, ILogger } from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { SettingType } from '@rocket.chat/apps-engine/definition/settings';

// Slash Commands
import { ToDoCommand } from './src/ToDoCommand';
import { CompleteCommand } from './src/CompleteCommand';


export class ToDoApp extends App {

    constructor(info: IAppInfo, logger: ILogger) {
        super(info, logger);
    }

    public async initialize(configuration: IConfigurationExtend): Promise<void> {
        await configuration.slashCommands.provideSlashCommand(new ToDoCommand());
        await configuration.slashCommands.provideSlashCommand(new CompleteCommand(this));

        await configuration.settings.provideSetting({
            id : 'use-user-name',
            i18nLabel: 'setting_use_user_name_label',
            i18nDescription: 'setting_use_user_name_desc',
            required: false,
            type: SettingType.BOOLEAN,
            public: true,
            packageValue: false,
        });

        await configuration.settings.provideSetting({
            id : 'collapse-on-complete',
            i18nLabel: 'setting_collapse_on_complete_label',
            i18nDescription: 'setting_collapse_on_complete_desc',
            required: false,
            type: SettingType.BOOLEAN,
            public: true,
            packageValue: true,
        });

    }
}
