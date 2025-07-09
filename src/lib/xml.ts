/**
 * This file provides a lightweight, dependency-free utility
 * to convert a JavaScript object into an XML string.
 * It uses a declarative, strongly-typed approach and always outputs formatted XML.
 */

// Define a recursive type for a node in the XML tree.
// It can be a simple string or a more complex element object.
type XmlNode = string | XmlElement

// An XmlElement has optional attributes and text content.
// All other properties are considered child tags, leading to a recursive structure.
interface XmlElement {
  _attributes?: Record<string, string | number | boolean>
  _text?: string
  // Index signature to allow for arbitrary tag names as keys.
  // The values are themselves XmlNodes or an array of them.
  [tagName: string]:
    | XmlNode
    | Array<XmlNode>
    | Record<string, string | number | boolean>
    | string
    | undefined
}

/**
 * Defines the root object structure for the XML document.
 * It must have a single root key representing the root element.
 */
type XmlObject = {
  [rootKey: string]: XmlNode
}

/**
 * Parameters for the buildNode function, bundled into a single object.
 */
interface BuildNodeParams {
  tagName: string
  node: XmlNode
  level: number
}

/**
 * Escapes special XML characters in a string.
 * @param str The string to escape.
 * @returns The escaped string.
 */
function escapeXml(str: string): string {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

/**
 * Creates a formatted string of attributes for an XML tag.
 * @param attributes The attributes object.
 * @returns A space-prefixed string of attributes or an empty string.
 */
function buildAttributesString(
  attributes: Record<string, string | number | boolean> | undefined,
): string {
  if (!attributes) {
    return ""
  }
  let attrsString = ""
  // eslint-disable-next-line guard-for-in
  for (const key in attributes) {
    const value = String(attributes[key])
    attrsString += ` ${key}="${escapeXml(value)}"`
  }
  return attrsString
}

/**
 * Recursively builds the XML string for all child nodes of a given node.
 * @param node The parent node object.
 * @param level The current indentation level for the children.
 * @returns The combined XML string for all child nodes.
 */
function buildChildNodes(node: XmlElement, level: number): string {
  const children: Array<string> = []
  for (const key in node) {
    if (key === "_attributes" || key === "_text") continue

    const childNode = node[key]
    if (Array.isArray(childNode)) {
      for (const item of childNode) {
        children.push(buildNode({ tagName: key, node: item, level }))
      }
    } else if (childNode !== undefined) {
      // We check for undefined to satisfy strict type checking
      children.push(
        buildNode({ tagName: key, node: childNode as XmlNode, level }),
      )
    }
  }
  return children.join("\n")
}

/**
 * Recursively builds an XML string from a node object.
 * This function orchestrates the creation of attributes, children, and text.
 * @param params The bundled parameters for building the node.
 * @returns The generated XML string for the node.
 */
function buildNode({ tagName, node, level }: BuildNodeParams): string {
  const indent = "  ".repeat(level)

  // Handle simple text nodes
  if (typeof node !== "object") {
    return `${indent}<${tagName}>${escapeXml(String(node))}</${tagName}>`
  }

  const attributes = buildAttributesString(node._attributes)
  const textContent = node._text ? escapeXml(String(node._text)) : null
  const children = buildChildNodes(node, level + 1)

  let xml = `${indent}<${tagName}${attributes}`

  if (!children && !textContent) {
    xml += "/>" // Self-closing tag
  } else {
    xml += ">"
    if (children) {
      xml += "\n" + children + "\n" + indent
    }
    if (textContent) {
      xml += textContent
    }
    xml += `</${tagName}>`
  }

  return xml
}

/**
 * Creates a formatted XML string from a declarative JavaScript object.
 * This is the main entry point for the builder.
 * @param obj The object defining the XML structure.
 * @returns A complete, pretty-printed XML string.
 */
export function create(obj: XmlObject): string {
  const rootKey = Object.keys(obj)[0]
  if (!rootKey) {
    return ""
  }

  return buildNode({
    tagName: rootKey,
    node: obj[rootKey],
    level: 0,
  })
}

// --- USAGE EXAMPLE ---

console.log("--- Building XML with the declarative object builder ---")

// Define the entire XML structure as a single object.
// This object is now checked against the strong types defined above.
const xmlDefinition: XmlObject = {
  root: {
    _attributes: { "xmlns:web": "http://www.w3.org/TR/html4/" },
    users: {
      user: [
        {
          _attributes: { id: 1, status: "active" },
          name: { _text: 'John "The Legend" Doe' },
          email: "j.doe@example.com", // Simple tags can just have a string value
          roles: {
            role: ["admin", "editor"],
          },
        },
        {
          _attributes: { id: 2, status: "inactive" },
          name: "Jane Smith",
          email: "jane.s@example.com",
        },
      ],
    },
    metadata: {
      timestamp: new Date().toISOString(),
    },
  },
}

// --- Generate and print the XML string ---

const xmlString = create(xmlDefinition)
console.log("\n--- Generated XML String ---")
console.log(xmlString)
