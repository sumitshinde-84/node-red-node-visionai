module.exports = (RED) => {
    const TeachableMachine = require("@patrick-paludo/teachablemachine-node");
    const main = function (config) {
      RED.nodes.createNode(this, config);
      this.modeluri = config.modeluri || "";
      const node = this;
      
      const model = new TeachableMachine({
        modelUrl: node.modeluri,
      });

      node.on("input", async (msg) => {

          try {
            node.status({ fill: "blue", shape: "dot", text: "processing..." });
            const predictions = await model.classify({
                imageUrl: msg.img,
            });

            node.status({});
            msg.payload = predictions;
        } catch (e) {
            console.error("ERROR", e);
            console.log(msg);
            node.error("Error during classification: " + e.message, msg);
        }
        node.send(msg);
      });
    };
  
    RED.nodes.registerType("visionAI", main);
  };