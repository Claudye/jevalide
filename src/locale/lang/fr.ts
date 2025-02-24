import { RulesMessages } from '../../contracts';

export const fr_messages: RulesMessages = {
  default: 'Ce champ est invalide',
  required: 'Ce champ est obligatoire',
  email: 'Veuillez saisir une adresse e-mail valide',
  maxlength: 'Le nombre maximum de caractères autorisés est : :arg0',
  minlength: 'Le nombre minimum de caractères requis est : :arg0',
  min: "Le champ :field doit être supérieur ou égal à ':arg0'",
  max: "Le champ :field doit être inférieur ou égal à ':arg0'",
  string: 'Veuillez saisir une chaîne de caractères',
  between: "La valeur de ce champ doit être comprise entre ':arg0' et ':arg1'",
  startWith: "Le champ :field doit commencer par ':arg0'",
  endWith: "Le champ :field doit se terminer par ':arg0'",
  contains: "Le champ :field doit contenir la valeur ':arg0'",
  in: 'Veuillez choisir une valeur correcte pour le champ :field',
  integer: 'Le champ :field doit être un nombre entier',
  int: 'Le champ :field doit être un nombre entier',
  number: 'Ce champ doit être un nombre',
  numeric: 'Ce champ doit être un nombre',
  file: 'Ce champ doit être un fichier',
  url: 'Ce champ doit être une URL valide',
  length: 'La longueur de ce champ doit être de :arg0',
  len: 'La longueur de ce champ doit être de :arg0',
  maxFileSize: 'La taille du fichier doit être inférieure à :arg0',
  minFileSize: 'La taille du fichier doit être supérieure à :arg0',
  size: 'La taille de ce champ doit être inférieure ou égale à :arg0',
  boolean: 'Ce champ doit être un booléen (oui ou non)',
  startWithUpper: 'Ce champ doit commencer par une lettre majuscule',
  startWithLower: 'Ce champ doit commencer par une lettre minuscule',
  nullable: '',
  password:
    'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
  date: 'Ce champ doit être une date valide',
  before: 'La date doit être antérieure à (:arg0)',
  after: 'La date doit être postérieure à (:arg0)',
  same: 'Ce champ doit être identique à la valeur du champ :arg0',
  equal: 'Ce champ doit être strictement égal à :arg0',
  requiredIf:
    'Le champ :field est requis lorsque le champ :arg0 a la valeur actuelle',
  requiredWhen:
    'Le champ :field est requis lorsque les champs :arg0 sont présents',
  phone: 'Ce numéro de téléphone semble invalide',
  time: 'Le champ :field doit être une heure valide',
  startWithString: 'Le champ :field doit commencer par une lettre',
  endWithString: 'Le champ :field doit se terminer par une lettre',
  excludes: 'Le champ :field ne doit pas contenir :arg0',
  hasLetter: 'Ce champ doit contenir au moins une lettre',
  regex: 'Ce champ est invalide',
  lower: 'Ce champ doit être en minuscules',
  upper: 'Ce champ doit être en majuscules',
  fileBetween: 'La taille du fichier doit être comprise entre :arg0 et :arg1',
  stringBetween:
    'Le nombre de caractères autorisés doit être compris entre :arg0 et :arg1',
  modulo: 'La valeur du champ :field doit être un multiple de :arg0',
  mod: 'La valeur du champ :field doit être un multiple de :arg0',
  only: "Le format de ce champ n'est pas accepté car il contient des caractères non autorisés",
  mimes: "Ce format de fichier n'est pas pris en charge",
  digit:
    'Ce champ doit être une valeur numérique comportant exactement :arg0 chiffres',
  minDigit:
    'Ce champ doit être une valeur numérique comportant au minimum :arg0 chiffres',
  maxDigit:
    'Ce champ doit être une valeur numérique comportant au maximum :arg0 chiffres',
  lessThan: 'Ce champ doit être une valeur numérique inférieure à :arg0',
  lthan: 'Ce champ doit être une valeur numérique inférieure à :arg0',
  greaterThan: 'Ce champ doit être une valeur numérique supérieure à :arg0',
  gthan: 'Ce champ doit être une valeur numérique supérieure à :arg0',
  dateBetween: 'La date doit être comprise entre :arg0 et :arg1',
  numberBetween:
    'Ce champ doit être une valeur numérique comprise entre :arg0 et :arg1',
  object: 'Ce champ doit être un objet valide',
  array: 'Ce champ doit être un tableau valide',
  json: 'Ce champ doit être une chaîne JSON valide',
};
