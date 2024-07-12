export const mixTwoEnPrompt = `
CONTEXT:
A game to explore philosophical concepts, where only the concepts or terms are seen, without pronouns, sentences, or explanations.

YOUR JOB:
Provide a term of philosophical interest or a philosophical concept (in the form of a SINGLE WORD or VERY SHORT EXPRESSION, but NEVER a phrase) that best captures the combination of the two concepts provided at the end of this prompt.
This term or concept must exist in English, have been commonly used by philosophers, and convey an DISTINCT idea from each of the proposed terms.
Simple and accessible terms or concepts are preferred, while terms from Greek or other foreign languages should be avoided unless entirely relevant.
Insert a single emoji that symbolize the concept best BEFORE the corresponding concept, followed by a space.

Here are the terms to combine: `;

export const mixTwoFrPrompt =
  "Propose un concept philosophique (sous la forme d'un seul mot ou d'un bref syntagme " +
  "qui articule plusieurs mots, par exemple conscience morale, mais EN AUCUN CAS une phrase " +
  "NI une explication) qui correspondrait le mieux à la synthèse des deux concepts " +
  "proposés à la fin de ce prompt. Il fait proposer un terme qui serait comme le résultat " +
  "du mélange 'chimique' des deux autres ou qui surgirait à l'esprit de celui qui les articulerait. " +
  "Le concept proposé doit exister dans ma langue, " +
  "avoir été couramment utilisé par des philosophes, et exprimer une idée qui n'est pas équivalente " +
  "à l'idée exprimée par chacun des termes proposés. Il faut fournir un concept du même ordre " +
  "que ceux proposés, c'est-à-dire qui relève du même type de réalité (par ex. deux vertus " +
  "doivent donner une autre vertus, pas un courant philosophique), du même registre et du même niveau de langue. " +
  "De manière générale, sauf si la synthèse demandée est très pointue, les concepts simples et accessibles sont à privilégier, " +
  "les termes issus du grec ou d'autres langues étrangères sont à éviter sauf s'ils sont totalement pertinents." +
  "Insère avant le concept une émoji qui pourrait le symboliser au mieux, ou une suite d'émoji si nécessaire. " +
  "Voici les deux termes proposés: ";

export const randomConceptFrPrompt = `Propose aléatoirement UN et UN SEUL terme (ou syntagme) issu du vocabulaire philosophique ou sur lequel peuvent porter les discussions philosophiques,
dans tous les domaines possibles que peut aborder la philosophie.
Fournis rien le terme ou concept, SANS phrase NI explication, précédé d'une émoji qui pourrait le symboliser.
Le terme peut être un objet de discussion commun comme la conscience, liberté, le courage, ou un concept introduit par des philosophes pour résoudre un problème ou représenter une idée originale.`;