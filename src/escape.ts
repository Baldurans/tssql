import {PrepareQueryArgument} from "./Types";
import {escape as libEscape, escapeId as libEscapeId} from "sqlstring";

export function escape(value: string | number | (string | number)[] | PrepareQueryArgument): string {
    return libEscape(value);
}

const mysqlReservedKeywords = new Set([
    "ADD", "ALL", "ALTER", "ANALYZE", "AND", "AS", "ASC", "AUTO_INCREMENT",
    "BETWEEN", "BIGINT", "BINARY", "BLOB", "BOTH", "BY", "CALL", "CASCADE",
    "CASE", "CHANGE", "CHAR", "CHARACTER", "CHECK", "COLLATE", "COLUMN",
    "CONDITION", "CONSTRAINT", "CONTINUE", "CONVERT", "CREATE", "CROSS",
    "CURRENT_DATE", "CURRENT_TIME", "CURRENT_TIMESTAMP", "CURRENT_USER", "CURSOR",
    "DATABASE", "DATABASES", "DAY_HOUR", "DAY_MICROSECOND", "DAY_MINUTE",
    "DAY_SECOND", "DEC", "DECIMAL", "DECLARE", "DEFAULT", "DELAYED", "DELETE",
    "DESC", "DESCRIBE", "DETERMINISTIC", "DISTINCT", "DISTINCTROW", "DIV",
    "DOUBLE", "DROP", "DUAL", "EACH", "ELSE", "ELSEIF", "ENCLOSED", "ESCAPED",
    "EXISTS", "EXIT", "EXPLAIN", "FALSE", "FETCH", "FLOAT", "FLOAT4", "FLOAT8",
    "FOR", "FORCE", "FOREIGN", "FROM", "FULLTEXT", "GRANT", "GROUP", "HAVING",
    "HIGH_PRIORITY", "HOUR_MICROSECOND", "HOUR_MINUTE", "HOUR_SECOND", "IF",
    "IGNORE", "IN", "INDEX", "INFILE", "INNER", "INOUT", "INSENSITIVE", "INSERT",
    "INT", "INT1", "INT2", "INT3", "INT4", "INT8", "INTEGER", "INTERVAL", "INTO",
    "IS", "ITERATE", "JOIN", "KEY", "KEYS", "KILL", "LEADING", "LEAVE", "LEFT",
    "LIKE", "LIMIT", "LINES", "LOAD", "LOCALTIME", "LOCALTIMESTAMP", "LOCK", "LONG",
    "LONGBLOB", "LONGTEXT", "LOOP", "LOW_PRIORITY", "MATCH", "MEDIUMBLOB",
    "MEDIUMINT", "MEDIUMTEXT", "MIDDLEINT", "MINUTE_MICROSECOND", "MINUTE_SECOND",
    "MOD", "MODIFIES", "NATURAL", "NOT", "NO_WRITE_TO_BINLOG", "NULL", "NUMERIC",
    "ON", "OPTIMIZE", "OPTION", "OPTIONALLY", "OR", "ORDER", "OUT", "OUTER",
    "OUTFILE", "PRECISION", "PRIMARY", "PROCEDURE", "PURGE", "RANGE", "READ",
    "READS", "REAL", "REFERENCES", "REGEXP", "RELEASE", "RENAME", "REPEAT",
    "REPLACE", "REQUIRE", "RESTRICT", "RETURN", "REVOKE", "RIGHT", "RLIKE",
    "SCHEMA", "SCHEMAS", "SECOND_MICROSECOND", "SELECT", "SENSITIVE", "SEPARATOR",
    "SET", "SHOW", "SMALLINT", "SPATIAL", "SPECIFIC", "SQL", "SQLEXCEPTION",
    "SQLSTATE", "SQLWARNING", "SQL_BIG_RESULT", "SQL_CALC_FOUND_ROWS", "SQL_SMALL_RESULT",
    "SSL", "STARTING", "STRAIGHT_JOIN", "TABLE", "TERMINATED", "THEN", "TINYBLOB",
    "TINYINT", "TINYTEXT", "TO", "TRAILING", "TRIGGER", "TRUE", "UNDO", "UNION",
    "UNIQUE", "UNLOCK", "UNSIGNED", "UPDATE", "USAGE", "USE", "USING", "UTC_DATE",
    "UTC_TIME", "UTC_TIMESTAMP", "VALUES", "VARBINARY", "VARCHAR", "VARCHARACTER",
    "VARYING", "WHEN", "WHERE", "WHILE", "WITH", "WRITE", "XOR", "YEAR_MONTH",
    "ZEROFILL"
]);

export function escapeId(value: string): string {
    // We could skip/remove this check, but it makes prettier SQL queries as 99% of strings here do not need escaping.
    if (typeof value === "string"
        && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)
        && !mysqlReservedKeywords.has(value.toUpperCase())) {
        return value;
    } else {
        return libEscapeId(value);
    }
}