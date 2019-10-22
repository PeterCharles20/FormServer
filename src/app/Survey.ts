import {Assessment} from './Assessment';

/**
 * Contains all the assessments and choices that have been imported from Drupal
 * The format of this class has been defined in Drupal, so that it can easily be converted into a JSON string
 * And update the corresponding data in Drupal
 */
export interface Survey {
    // The label of a tab-view
    tabViewLabel: string;
    // The id of a tab-view
    tabViewId: string;
    // The VID of a tab-view
    tabViewVid: string;
    // The created time of a tab-view
    tabViewCreatedTime: string;
    // The changed time of a tab-view
    tabViewChangedTime: string;
    // An array of assessments associated with a tab-view
    assessments: Assessment[];
}
