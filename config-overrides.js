// config-overrides.js (compatibile CRA 5)
module.exports = {
  // lascio webpack “trasparente”
  webpack: (config, env) => {
    return config;
  },

  // CRA5 usa una factory: devi restituire una funzione che riceve (proxy, allowedHost)
  devServer: (configFunction) => {
    return (proxy, allowedHost) => {
      const config = configFunction(proxy, allowedHost);

      // 🔧 Fix definitivo: forza allowedHosts a "all"
      config.allowedHosts = 'all';

      // (opzionale) se vuoi forzare il bind su tutte le interfacce:
      // config.host = '0.0.0.0';

      // (debug opzionale) per vedere il valore a runtime
      // console.log('DevServer allowedHosts =', config.allowedHosts);

      return config;
    };
  }
};
