import { RefineAnswer } from "../chains/index.js";
import { ChatModel } from "../ai_models/openai-chat.js";

let originalQuestion ="What according to Mahabharata are the most important duties of a person?";
let existingAnswer = "According to the Mahabharata, the most important duties of a person, specifically a householder, include abstention from injury, truthfulness of speech, compassion towards all beings, tranquillity of soul, and making gifts to the best of one's power. The householder should also abstain from sexual congress with the spouses of other men, protect wealth and the woman committed to one's charge, avoid appropriating what is not given, and refrain from consuming honey and meat. Additionally, the householder should practice self-restraint, study the Vedas, be patient in undergoing austerities, and engage in charity and performing sacrifices. The duties of a Kshatriya involve the protection of the other orders, while the Vaisya's duties include agriculture, cattle-rearing, and trade. The Sudra's duty is the service of the three regenerate classes. Common duties for all four orders include compassion, abstention from injury, heedfulness, giving others what is due to them, Sraddhas in honor of deceased ancestors, hospitality to guests, truthfulness, subjugation of wrath, contentedness with one's own wedded wives, purity, freedom from malice, knowledge of Self, and Renunciation.";
let context = "The concept of duty differs for each of the four orders mentioned in the Mahabharata. For the householder, the foremost duties are abstention from injury, truthfulness of speech, compassion towards all beings, tranquillity of soul, and making gifts to the best of one's power. The five chief duties for the householder are abstention from sexual congress with the spouses of other men, protection of wealth and the woman committed to one's charge, unwillingness to appropriate what is not given, and avoidance of honey and meat. For the Brahmana, self-restraint, study of the Vedas, patience in undergoing austerities, and practicing charity and performing sacrifices are the main duties. The Kshatriya's duty is the protection of the other orders, while the Vaisya's duties include agriculture, cattle-rearing, and trade. The Sudra's duty is the service of the three regenerate classes. Common duties for all four orders include compassion, abstention from injury, heedfulness, giving others what is due to them, Sraddhas in honor of deceased ancestors, hospitality to guests, truthfulness, subjugation of wrath, contentedness with one's own wedded wives, purity, freedom from malice, knowledge of Self, and Renunciation"
let temperature = 0;
const llm = ChatModel.model(temperature, true);

let refineAnswer = RefineAnswer.from_llm(llm);
let result = await refineAnswer.predict({
    originalQuestion,
    existingAnswer,
    context,
});
console.log(existingAnswer)
console.log('Result --> ', result);
