
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationEnd, NavigationExtras, Router, RouterStateSnapshot} from '@angular/router';
import {LoggerFactory} from '@elderbyte/ts-logger';

/**
 * This service manages the side content.
 * This is usually the left side which is a 'side nav' and the right side which shows detail information.
 */
@Injectable()
export class SideContentService {


    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly logger = LoggerFactory.getLogger('SideContentService');

    private _navigationOpen = false;
    private _sideContentOpen = false;
    private _detailContentOutlet = 'side';
    private _clickOutsideToClose = true;


    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/


    constructor(
        private router: Router,
    ) {

        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(event => event as NavigationEnd)
            .subscribe(event => {

                if (this.isOutletActive(this.detailContentOutlet)) {
                    this.logger.debug(`"${this.detailContentOutlet}" outlet is active -> showing side content!`);
                    this.showSideContent();
                }else {
                    this.logger.debug(`"${this.detailContentOutlet}" outlet is NOT active -> HIDING side content!`);
                    this.closeSideContent();
                }
                this.closeSideNav();
            });
    }

    /***************************************************************************
     *                                                                         *
     * Properties                                                              *
     *                                                                         *
     **************************************************************************/

    /**
     * Checks if the side content is currently open
     */
    public get sideContentOpen(): boolean {
        return this._sideContentOpen;
    }

    public set sideContentOpen(value: boolean) {
        this._sideContentOpen = value;
    }

    /**
     * Checks if the navigation is open
     */
    public get navigationOpen(): boolean {
        return this._navigationOpen;
    }

    public set navigationOpen(value: boolean) {
        this._navigationOpen = value;
    }

    /**
     * Gets the name of the detail outlet.
     * Default is 'side'
     */
    public get detailContentOutlet(): string {
        return this._detailContentOutlet;
    }

    /**
     * Sets the name of the detail outlet.
     */
    public set detailContentOutlet(value: string) {
        this._detailContentOutlet = value;
    }

    /**
     * Allow closing the side content by clicking outside of it.
     */
    public get clickOutsideToClose(): boolean {
        return this._clickOutsideToClose;
    }


    public set clickOutsideToClose(value: boolean) {
        this._clickOutsideToClose = value;
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    /**
     * Toggles the side navigation
     */
    public toggleSidenav() {
        this.navigationOpen = !this.navigationOpen;
    }

    /**
     * Closes the side navigation
     */
    public closeSideNav() {
        this.navigationOpen = false;
    }

    /**
     * Closes the side detail content
     */
    public closeSideContent() {
        this.logger.debug('Hiding ...');
        this.sideContentOpen = false;


        const command = {};
        command['outlets'] = {};
        command['outlets'][this.detailContentOutlet] = null;

        this.router.navigate([
            command
            ]);
    }

    /**
     * Shows the side content
     * @param args The route arguments / path
     * @param clickOutsideToClose If enabled, the side content can be closed by clicking outside of it.
     * @param extras
     */
    public navigateSideContent(args: string[], clickOutsideToClose: boolean, extras?: NavigationExtras): Promise<boolean> {

        this.clickOutsideToClose = clickOutsideToClose;

        const command = {};
        command['outlets'] = {};
        command['outlets'][this.detailContentOutlet] = args;

        return this.router.navigate(
            [command],
            extras
        );
    }

    /***************************************************************************
     *                                                                         *
     * Private methods                                                         *
     *                                                                         *
     **************************************************************************/

    private isOutletActive(outlet: string): boolean {
        let rs: RouterStateSnapshot =  this.router.routerState.snapshot;
        let snap: ActivatedRouteSnapshot = rs.root;
        return this.isOutletActiveRecursive(snap, outlet);
    }

    private isOutletActiveRecursive(root: ActivatedRouteSnapshot, outlet: string): boolean {
        if (root.outlet === outlet) {
            return true;
        }
        for (let c of root.children) {
            if (this.isOutletActiveRecursive(c, outlet)) {
                return true;
            }
        }
        return false;
    }

    private showSideContent() {
        this.logger.debug('Showing ...');
        this.sideContentOpen = true;
    }

}
