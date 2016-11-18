import React, {Component, PropTypes } from "react";
import Tabs from "dnn-tabs";
import Localization from "../../localization";
import PageDetails from "../PageDetails/PageDetails";
import PermissionGrid from "../PermissionGrid/PermissionGrid";
import Button from "dnn-button";
import styles from "./style.less";
import Modules from "../Modules/Modules";
import Seo from "../Seo/Seo";
import More from "../More/More";
import Appearance from "../Appearance/Appearance";
import PageTypeSelector from "../PageTypeSelector/PageTypeSelector";
import PageLocalization from "../PageLocalization/PageLocalization";

class PageSettings extends Component {

    hasPageErrors() {
        const {selectedPageErrors} = this.props;
        return Object.keys(selectedPageErrors)
            .map(key => selectedPageErrors[key])
            .some(value => value);
    }

    getButtons() {
        const {selectedPage, onCancel, onSave} = this.props;
        const saveButtonText = selectedPage.tabId === 0 ? 
            Localization.get("AddPage") : Localization.get("Save");
        const pageErrors = this.hasPageErrors();

        return [<Button
                    type="secondary"
                    onClick={onCancel}>
                    {Localization.get("Cancel")}
                </Button>,
                <Button
                    type="primary"
                    onClick={onSave}
                    disabled={pageErrors}>
                    {saveButtonText}
                </Button>];
    }

    getPageFooter(buttons) {
        const {selectedPageDirty} = this.props;
        return (
            <div className="buttons-box">
                {buttons}
                {selectedPageDirty && 
                    <div className="dirty-info">
                        {Localization.get("ChangesNotSaved")}
                    </div>
                }
            </div>
        );
    }

    getCopyAppearanceToDescendantPagesButton() {
        return <Button 
                type="secondary"
                onClick={this.props.onCopyAppearanceToDescendantPages}> 
                {Localization.get("CopyAppearanceToDescendantPages")}
            </Button>;
    }

    getCopyPermissionsToDescendantPagesButton() {
        return <Button 
                type="secondary"
                onClick={this.props.onCopyPermissionsToDescendantPages}> 
                {Localization.get("CopyPermissionsToDescendantPages")}
            </Button>;
    }

    render() {
        const {
            selectedPage, 
            selectedPageErrors, 
            onChangeField, 
            onChangePageType, 
            onDeletePageModule, 
            onEditingPageModule,
            onCancelEditingPageModule,
            editingSettingModuleId,
            pageDetailsFooterComponents,
            pageTypeSelectorComponents
        } = this.props;

        const buttons = this.getButtons();
        const isEditingExistingPage = selectedPage.tabId !== 0;
        const appearanceButtons = [...buttons];
        const permissionsButtons = [...buttons];

        if (isEditingExistingPage && selectedPage.hasChild) {
            appearanceButtons.unshift(this.getCopyAppearanceToDescendantPagesButton());
            permissionsButtons.unshift(this.getCopyPermissionsToDescendantPagesButton());
        }        

        const footer = this.getPageFooter(buttons);
        const appearanceFooter = this.getPageFooter(appearanceButtons);
        const permissionFooter = this.getPageFooter(permissionsButtons);

        const advancedTabs = [
            {
                label: Localization.get("Appearance"),
                component: <div className="dnn-simple-tab-item">
                                <Appearance page={selectedPage}
                                    onChangeField={onChangeField} />
                                {appearanceFooter}
                            </div>
            },
            {
                label: Localization.get("SEO"),
                component: <div className="dnn-simple-tab-item">
                                <Seo page={selectedPage}
                                    onChangeField={onChangeField} />
                                {footer}
                            </div>
            },
            {
                label: Localization.get("More"),
                component: <div className="dnn-simple-tab-item">
                                <More page={selectedPage}
                                    onChangeField={onChangeField} />
                                {footer}
                            </div>
            }
        ];

        if (isEditingExistingPage && selectedPage.pageType === "normal") {
            advancedTabs.unshift({
                label: Localization.get("Modules"),
                component: <div className="dnn-simple-tab-item">
                                <Modules 
                                    modules={selectedPage.modules} 
                                    onDeleteModule={onDeletePageModule}
                                    onEditingModule={onEditingPageModule}
                                    onCancelEditingModule={onCancelEditingPageModule}
                                    editingSettingModuleId={editingSettingModuleId} />
                            </div>
            });
        }

        return (
            <Tabs 
                tabHeaders={[Localization.get("Details"), 
                             Localization.get("Permissions"), 
                             Localization.get("Localization"),
                             Localization.get("Advanced")]}
                className={styles.pageSettings}>
                <div className="dnn-simple-tab-item">
                    <PageTypeSelector
                        page={selectedPage}
                        onChangePageType={onChangePageType} 
                        components={pageTypeSelectorComponents} />
                    <PageDetails 
                        page={selectedPage}
                        errors={selectedPageErrors} 
                        onChangeField={onChangeField}
                        components={pageDetailsFooterComponents} />
                    {footer}
                </div>
                <div className="dnn-simple-tab-item">                
                    <PermissionGrid
                        permissions={selectedPage.permissions} 
                        onPermissionsChanged={this.props.onPermissionsChanged} />
                    {permissionFooter}
                </div>
                <div className="dnn-simple-tab-item">
                    <PageLocalization
                        page={selectedPage}
                     />
                </div>
                <div>
                    <Tabs 
                        tabHeaders={advancedTabs.map(tab => tab.label)}                        
                        type="secondary">
                        {advancedTabs.map(tab => tab.component)}
                    </Tabs>
                </div>
            </Tabs>
        );
    }    
}

PageSettings.propTypes = {
    selectedPage: PropTypes.object.isRequired,
    selectedPageErrors: PropTypes.object.isRequired,
    selectedPageDirty: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onChangeField: PropTypes.func.isRequired,
    onPermissionsChanged: PropTypes.func.isRequired,
    onChangePageType: PropTypes.func.isRequired,
    onDeletePageModule: PropTypes.func.isRequired,
    onEditingPageModule: PropTypes.func.isRequired,
    onCancelEditingPageModule: PropTypes.func.isRequired,
    onCopyAppearanceToDescendantPages: PropTypes.func.isRequired,
    onCopyPermissionsToDescendantPages: PropTypes.func.isRequired,
    editingSettingModuleId: PropTypes.number,
    pageDetailsFooterComponents: PropTypes.array.isRequired,
    pageTypeSelectorComponents: PropTypes.array.isRequired
};

export default PageSettings;
