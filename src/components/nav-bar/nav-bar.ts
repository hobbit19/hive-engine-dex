import { HiveEngine } from '../../services/hive-engine';
import { SigninModal } from './../../modals/signin';
import { DialogService } from 'aurelia-dialog';
import { customElement, bindable } from 'aurelia-framework';
import { autoinject } from 'aurelia-dependency-injection';
import { connectTo } from 'aurelia-store';
import { faWallet } from '@fortawesome/pro-duotone-svg-icons';

import styles from './nav-bar.module.css';

@autoinject()
@customElement('nav-bar')
@connectTo()
export class NavBar {
    @bindable router;
    @bindable loggedIn;
    @bindable claims;
    @bindable iconWallet = faWallet;

    private styles = styles;

    private state: State;

    constructor(private dialogService: DialogService, private se: HiveEngine) {        
    }

    async logout() {
        await this.se.logout();        
        this.router.navigateToRoute('home');
    }

    signin() {
        this.dialogService.open({ viewModel: SigninModal }).whenClosed(response => {
            if (!response.wasCancelled) {
                // redirect to home if login was successfull
                this.router.navigateToRoute('tokens');
            }
        });
    }
}
