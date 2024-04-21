export function templateFormatter( html: string, replacements: Record<string, string> ){
  return html.replace(
      /%(\w*)%/g,
      function( m, key ){
        return replacements.hasOwnProperty( key ) ? replacements[ key ] : "";
      }
    );
}
