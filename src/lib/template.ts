/**
 * Replaces placeholders in a template string with values from a content object.
 * The placeholders are expected to be in the format {{key}}.
 *
 * @param template The template string containing placeholders.
 * @param content A record object where keys match the placeholder names
 * (without curly braces) and values are the content to insert.
 * @returns The template string with all placeholders replaced.
 */
export function replacePlaceholders(
  template: string,
  content: Record<string, string>,
): string {
  // We'll start with the original template and iteratively replace each placeholder.
  let result = template

  // Iterate over each key-value pair in the content object.
  for (const key in content) {
    // Ensure the key belongs to the object itself, not its prototype chain.
    if (Object.prototype.hasOwnProperty.call(content, key)) {
      // Create a regular expression to find all occurrences of the placeholder.
      // For a key "name", this will create a regex for /{{name}}/g.
      // The 'g' flag ensures that all instances are replaced, not just the first one.
      const placeholderRegex = new RegExp(`{{${key}}}`, "g")

      // Replace the current placeholder in the result string with its corresponding value.
      result = result.replace(placeholderRegex, content[key])
    }
  }

  // Return the final string after all replacements have been made.
  return result
}
