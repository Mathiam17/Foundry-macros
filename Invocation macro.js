/*
 * Invocation
 *
 * This macro will regen mana equal to your proficiency bonus
 * Additionally it sets the number of Invocations one can use
 *
 */

/* Variables */

let chatMsg = "";
let chatEnabled = true;
let mage = "";

let prof = actor.data.data.attributes.prof;
let hasAvailableUses = false;
let newResources = duplicate(actor.data.data.resources);

let manaObj = {};
let mana = actor.data.data.resources.primary;

let usesObj = {};
let uses = actor.data.data.resources.secondary;

// Make sure one of your resources are named EXACTLY like ResourceName and ManaName
const UsesName = "Invocation uses";
const ManaName = "Mana";

// Messages
const Namespace = "Mathiam Macros | Invocation | ";
const InvocationMsg = ` is using Invocation and regenerates ${prof} mana`;
const errorNoUses = " has no more Invocation uses left.";
const errorNoUsesResource = ` has no resource called ${UsesName}`;
const errorNoManaResource = ` has no resource called ${ManaName}`;
const errorFullMana = " already has full mana";

/*************/

// Checks if selected token/actor is a Mage
if (actor !== undefined && actor !== null) {
  mage = actor.items.find((i) => i.name === "Mage");
  if (mage == undefined) {
    ui.notifications.warn("Selected token isn't a Mage");
  }
  if (mage !== undefined && mage !== null) {
    // If no primary resource is found returns a warning
    if (mana == undefined) {
      ui.notifications.warn(`${actor.name} ${errorNoManaResource}`);
      return;
    }

    // If no secondary resource is found returns a warning
    if (uses == undefined) {
      ui.notifications.warn(`${actor.name} ${errorNoUsesResource}`);
      return;
    }

    // Checks if current mana pool is already full
    if (mana.value >= mana.max) {
      ui.notifications.warn(`${actor.name} ${errorFullMana}`);
      return;
    }

    // Consume Invocation use section

    if (uses && uses.value > 0) {
      hasAvailableUses = true;
      newResources.secondary.value--;
      usesObj["data.resources"] = newResources;
      console.log(
        `${Namespace}The remaining Invocation uses are equal to ${newResources.secondary.value}`
      );
      actor.update(usesObj);
    }

    if (!hasAvailableUses) {
      ui.notifications.warn(`${actor.name} ${errorNoUses}`);
      return;
    }

    // Mana Regen Section

    if (mana && hasAvailableUses && mana.value < mana.max) {
      chatMsg = `${actor.name} ${InvocationMsg}`;
      let newManaValue = newResources.primary.value + prof;
      newResources.primary.value = newManaValue;
      manaObj["data.resources"] = newResources;
      console.log(
        `${Namespace}The new mana value is equal to ${newResources.primary.value}`
      );
      actor.update(manaObj);
    }
  }
}
// Sends a chat message if necessary
if (chatMsg !== "" && chatEnabled) {
  let chatData = {
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: chatMsg,
  };
  ChatMessage.create(chatData, {});
}
