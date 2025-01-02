import {getValue , hasValue} from '../lodash';


/**
 * Array Helper Class
 */
export class ArrayHelper{

    static getValue(object : any , key : any , deafultValue : any = ''){
       return  getValue(object , key , deafultValue);
    }

    static hasValue(object : any , key : any) {
        return hasValue(object, key);
    }
}