import winston from "winston";

const logger: winston.Logger = createLogger();

function createLogger() {
  const transportOptions: winston.transport[] = [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ];
  if (process.env.NODE_ENV !== "development") {
    transportOptions.push(
      new winston.transports.File({
        filename: "logs/error.log",
        level: "error",
      }),
      new winston.transports.File({ filename: "logs/info.log", level: "info" }),
      new winston.transports.File({ filename: "logs/all.log" })
    );
  }

  return winston.createLogger({
    transports: transportOptions,
  });
}

export default logger;
