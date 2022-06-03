namespace riz.cds.lt;

using {
    cuid,
    managed
} from '@sap/cds/common';

entity TestRecords : cuid, managed {

    stringField      : String;
    largeStringField : LargeString;
    booleanField     : Boolean;
    integerField     : Integer;
    integer64Field   : Integer64;
    decimalField     : Decimal;
    doubleField      : Double;
    dateField        : Date;
    timeField        : Time;
    dateTimeField    : DateTime;
    timeStampField   : Timestamp;

}
