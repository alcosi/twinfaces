export enum TwinClassLinkTypes {
  OneToOne = "OneToOne",
  ManyToMany = "ManyToMany",
  ManyToOne = "ManyToOne",
}

export enum TwinClassLinkStrength {
  MANDATORY = "MANDATORY",
  OPTIONAL = "OPTIONAL",
  OPTIONAL_BUT_DELETE_CASCADE = "OPTIONAL_BUT_DELETE_CASCADE",
}
