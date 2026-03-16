import Ajv, { type ValidateFunction, type ErrorObject } from 'ajv'
// eslint-disable-next-line @typescript-eslint/no-require-imports
import addFormats from 'ajv-formats'

// We embed the JSON Resume schema to avoid CORS issues
const JSON_RESUME_SCHEMA = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Resume Schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "$schema": { "type": "string" },
    "basics": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "name": { "type": "string" },
        "label": { "type": "string" },
        "image": { "type": "string" },
        "email": { "type": "string", "format": "email" },
        "phone": { "type": "string" },
        "url": { "type": "string", "format": "uri" },
        "summary": { "type": "string" },
        "location": {
          "type": "object",
          "additionalProperties": true,
          "properties": {
            "address": { "type": "string" },
            "postalCode": { "type": "string" },
            "city": { "type": "string" },
            "countryCode": { "type": "string" },
            "region": { "type": "string" }
          }
        },
        "profiles": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
              "network": { "type": "string" },
              "username": { "type": "string" },
              "url": { "type": "string", "format": "uri" }
            }
          }
        }
      }
    },
    "work": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": true,
        "properties": {
          "name": { "type": "string" },
          "location": { "type": "string" },
          "description": { "type": "string" },
          "position": { "type": "string" },
          "url": { "type": "string", "format": "uri" },
          "startDate": { "type": "string" },
          "endDate": { "type": "string" },
          "summary": { "type": "string" },
          "highlights": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "volunteer": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": true,
        "properties": {
          "organization": { "type": "string" },
          "position": { "type": "string" },
          "url": { "type": "string", "format": "uri" },
          "startDate": { "type": "string" },
          "endDate": { "type": "string" },
          "summary": { "type": "string" },
          "highlights": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "education": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": true,
        "properties": {
          "institution": { "type": "string" },
          "url": { "type": "string", "format": "uri" },
          "area": { "type": "string" },
          "studyType": { "type": "string" },
          "startDate": { "type": "string" },
          "endDate": { "type": "string" },
          "score": { "type": "string" },
          "courses": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "awards": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": true,
        "properties": {
          "title": { "type": "string" },
          "date": { "type": "string" },
          "awarder": { "type": "string" },
          "summary": { "type": "string" }
        }
      }
    },
    "certificates": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": true,
        "properties": {
          "name": { "type": "string" },
          "date": { "type": "string" },
          "issuer": { "type": "string" },
          "url": { "type": "string", "format": "uri" }
        }
      }
    },
    "publications": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": true,
        "properties": {
          "name": { "type": "string" },
          "publisher": { "type": "string" },
          "releaseDate": { "type": "string" },
          "url": { "type": "string", "format": "uri" },
          "summary": { "type": "string" }
        }
      }
    },
    "skills": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": true,
        "properties": {
          "name": { "type": "string" },
          "level": { "type": "string" },
          "keywords": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "languages": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": true,
        "properties": {
          "language": { "type": "string" },
          "fluency": { "type": "string" }
        }
      }
    },
    "interests": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": true,
        "properties": {
          "name": { "type": "string" },
          "keywords": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "references": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": true,
        "properties": {
          "name": { "type": "string" },
          "reference": { "type": "string" }
        }
      }
    },
    "projects": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": true,
        "properties": {
          "name": { "type": "string" },
          "description": { "type": "string" },
          "highlights": { "type": "array", "items": { "type": "string" } },
          "keywords": { "type": "array", "items": { "type": "string" } },
          "startDate": { "type": "string" },
          "endDate": { "type": "string" },
          "url": { "type": "string", "format": "uri" },
          "roles": { "type": "array", "items": { "type": "string" } },
          "entity": { "type": "string" },
          "type": { "type": "string" }
        }
      }
    },
    "meta": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "canonical": { "type": "string", "format": "uri" },
        "version": { "type": "string" },
        "lastModified": { "type": "string" }
      }
    }
  }
}

let validate: ValidateFunction | null = null

export function getValidator(): ValidateFunction {
  if (!validate) {
    const ajv = new Ajv({ allErrors: true })
    // addFormats may not be available — try adding it, silently skip if not
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addFormats as any)(ajv)
    } catch {
      // ajv-formats not installed — continue without format validation
    }
    // Strip $schema so AJV v8 doesn't try to resolve draft-04 as a meta-schema ref
    const { $schema: _ignored, ...schemaWithoutMeta } = JSON_RESUME_SCHEMA as Record<string, unknown>
    validate = ajv.compile(schemaWithoutMeta)
  }
  return validate
}

export interface ValidationResult {
  valid: boolean
  parseError: string | null
  schemaErrors: ErrorObject[]
}

export function validateResumeJson(json: string): ValidationResult {
  if (!json.trim()) {
    return { valid: false, parseError: 'JSON is empty', schemaErrors: [] }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch (e) {
    return {
      valid: false,
      parseError: e instanceof Error ? e.message : 'Invalid JSON',
      schemaErrors: [],
    }
  }

  const validator = getValidator()
  const valid = validator(parsed) as boolean
  return {
    valid,
    parseError: null,
    schemaErrors: validator.errors ?? [],
  }
}
