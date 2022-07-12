@protocol: 'rest'
service MassChangeService {
    
    @open
    type AnyArray {};
    
    action insertAll(insEntity : String, insArray: AnyArray) returns AnyArray;
 
}
 