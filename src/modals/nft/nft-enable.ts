import { customJson } from 'common/keychain';
import { HiveEngine } from 'services/hive-engine';
import { DialogController } from 'aurelia-dialog';
import { autoinject, TaskQueue, useView, PLATFORM } from 'aurelia-framework';
import styles from './nft-enable.module.css';

import { environment } from 'environment';

@autoinject()
@useView(PLATFORM.moduleName('modals/nft/nft-enable.html'))
export class NftEnableModal {
    private styles = styles;
    private token;
    private properties: any[] = [];
    private validProperties: string[] = [];

    constructor(private controller: DialogController, private se: HiveEngine, private taskQueue: TaskQueue) {
        this.controller.settings.lock = false;
        this.controller.settings.centerHorizontalOnly = true;    
    }

    async activate(token) {
        this.token = token;

        this.validProperties = token.properties.reduce((acc, value) => {
            acc.push(value.name);
            
            return acc;
        }, []);
    }

    async setGroupBy() {
        const properties = this.properties.reduce((acc, value) => {
            if (value?.name) {
                acc.push(value.name);
            }

            return acc;
        }, []);

        const payload = {
            contractName: 'nft',
            contractAction: 'setGroupBy',
            contractPayload: {
                symbol: this.token.symbol,
                properties: properties
            }
        };

        if (window.hive_keychain) {
            const response = await customJson(this.se.getUser(), environment.chainId, 'Active', JSON.stringify(payload), `Set Group By Properties`);

            if (response.success) {
                this.controller.ok();
            }
        }
    }

    addPropertyRow() {
        this.properties.push({name: ''});
    }

    removeProperty($index) {
        this.properties.splice($index, 1);
    }
}
