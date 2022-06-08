using {riz.cds.lt as my} from '../db/model';

@path : 'refsvc'
service ReferenceService {
    entity TestRecords as projection on my.TestRecords ;
    action deleteAllRecs();
}
