import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  module PatientRecord {
    public func compare(p1 : PatientRecord, p2 : PatientRecord) : Order.Order {
      Text.compare(p1.patientId, p2.patientId);
    };
  };

  public type PatientRecord = {
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

  let patients = Map.empty<Text, PatientRecord>();

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  var patientIdCounter = 0;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Patient Management Functions
  public shared ({ caller }) func addPatient(
    encryptedName : Text,
    encryptedAge : Text,
    bloodType : Text,
    encryptedNotes : Text,
    encryptedEmergencyContact : Text,
    emergencyPhone : Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only staff can add patients");
    };

    let patientId = patientIdCounter.toText();
    patientIdCounter += 1;
    let timestamp = Time.now();

    let record : PatientRecord = {
      patientId;
      owner = caller;
      encryptedName;
      encryptedAge;
      bloodType;
      encryptedNotes;
      encryptedEmergencyContact;
      emergencyPhone;
      createdAt = timestamp;
    };

    patients.add(patientId, record);
    patientId;
  };

  public query ({ caller }) func getPatient(id : Text) : async ?PatientRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only staff can view patients");
    };
    switch (patients.get(id)) {
      case (?record) {
        if (record.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?record;
        } else {
          null;
        };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func listPatients() : async [PatientRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only staff can list patients");
    };
    let all = patients.values().toArray();
    if (AccessControl.isAdmin(accessControlState, caller)) {
      all.sort();
    } else {
      all.filter(func(r : PatientRecord) : Bool { r.owner == caller }).sort();
    };
  };

  public shared ({ caller }) func updatePatient(
    id : Text,
    encryptedName : Text,
    encryptedAge : Text,
    bloodType : Text,
    encryptedNotes : Text,
    encryptedEmergencyContact : Text,
    emergencyPhone : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only staff can update patients");
    };

    switch (patients.get(id)) {
      case (?existing) {
        if (existing.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only edit your own patients");
        };
        let updated : PatientRecord = {
          patientId = id;
          owner = existing.owner;
          encryptedName;
          encryptedAge;
          bloodType;
          encryptedNotes;
          encryptedEmergencyContact;
          emergencyPhone;
          createdAt = existing.createdAt;
        };
        patients.add(id, updated);
      };
      case (null) { Runtime.trap("Patient not found") };
    };
  };

  public shared ({ caller }) func deletePatient(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete patients");
    };

    if (not patients.containsKey(id)) {
      Runtime.trap("Patient not found");
    };

    patients.remove(id);
  };
};
