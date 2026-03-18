import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type OldPatientRecord = {
    patientId : Text;
    encryptedName : Text;
    encryptedAge : Text;
    bloodType : Text;
    encryptedNotes : Text;
    encryptedEmergencyContact : Text;
    emergencyPhone : Text;
    createdAt : Int;
  };

  type OldActor = {
    patients : Map.Map<Text, OldPatientRecord>;
  };

  type NewPatientRecord = {
    patientId : Text;
    owner : Principal;
    encryptedName : Text;
    encryptedAge : Text;
    bloodType : Text;
    encryptedNotes : Text;
    encryptedEmergencyContact : Text;
    emergencyPhone : Text;
    createdAt : Int;
  };

  type NewActor = {
    patients : Map.Map<Text, NewPatientRecord>;
  };

  public func run(old : OldActor) : NewActor {
    let newPatients = old.patients.map<Text, OldPatientRecord, NewPatientRecord>(
      func(_id, oldRecord) {
        { oldRecord with owner = Principal.anonymous() };
      }
    );
    { patients = newPatients };
  };
};
